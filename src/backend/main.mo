import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Product type definition
  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Text;
    affiliateUrl : Text;
    imageUrl : Text;
    category : Text;
    isActive : Bool;
    createdAt : Int;
  };

  module Product {
    // Default comparison by ID (lowest first)
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };

    // Custom comparison by name (lexicographically A-Z)
    public func compareByName(product1 : Product, product2 : Product) : Order.Order {
      Text.compare(product1.name, product2.name);
    };
  };

  // User profile type definition
  public type UserProfile = {
    name : Text;
  };

  let products = Map.empty<Nat, Product>();
  var nextProductId = 1;
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Seed initial products - Admin only
  public shared ({ caller }) func initialize() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize products");
    };

    let initialProducts = [
      {
        name = "iPhone Charging Cable";
        description = "Durable 6ft USB-C to Lightning cable for iPhone";
        price = "$5.99";
        affiliateUrl = "https://temu.com/charging-cable";
        imageUrl = "https://temu.com/images/cable.jpg";
        category = "Phone Accessories";
      },
      {
        name = "Wireless Desk Lamp";
        description = "Adjustable LED lamp with USB charging port";
        price = "$19.99";
        affiliateUrl = "https://temu.com/desk-lamp";
        imageUrl = "https://temu.com/images/lamp.jpg";
        category = "Lighting";
      },
      {
        name = "Cable Organizer";
        description = "Silicone clips to keep your cords tidy";
        price = "$4.49";
        affiliateUrl = "https://temu.com/cable-organizer";
        imageUrl = "https://temu.com/images/organizer.jpg";
        category = "Desk Setup";
      },
      {
        name = "Wireless Earbuds";
        description = "Affordable Bluetooth earbuds with case";
        price = "$14.99";
        affiliateUrl = "https://temu.com/earbuds";
        imageUrl = "https://temu.com/images/earbuds.jpg";
        category = "Phone Accessories";
      },
      {
        name = "LED Strip Lights";
        description = "Color-changing lights for desks or rooms";
        price = "$12.99";
        affiliateUrl = "https://temu.com/led-lights";
        imageUrl = "https://temu.com/images/lights.jpg";
        category = "Lighting";
      },
      {
        name = "Drawer Organizer";
        description = "Expandable organizers for desk drawers";
        price = "$9.99";
        affiliateUrl = "https://temu.com/drawer-organizer";
        imageUrl = "https://temu.com/images/drawer.jpg";
        category = "Storage";
      },
    ];

    for (product in initialProducts.values()) {
      let newProduct : Product = {
        id = nextProductId;
        name = product.name;
        description = product.description;
        price = product.price;
        affiliateUrl = product.affiliateUrl;
        imageUrl = product.imageUrl;
        category = product.category;
        isActive = true;
        createdAt = Time.now();
      };
      products.add(nextProductId, newProduct);
      nextProductId += 1;
    };
  };

  // Public Queries - No auth required

  public query ({ caller }) func getAllActiveProducts() : async [Product] {
    let activeProducts = List.empty<Product>();
    for ((_, product) in products.entries()) {
      if (product.isActive) {
        activeProducts.add(product);
      };
    };
    activeProducts.toArray().sort(Product.compareByName);
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    let filteredProducts = List.empty<Product>();
    for ((_, product) in products.entries()) {
      if (product.category == category and product.isActive) {
        filteredProducts.add(product);
      };
    };
    filteredProducts.toArray().sort(Product.compareByName);
  };

  public query ({ caller }) func getAllCategories() : async [Text] {
    let categories = Set.empty<Text>();
    for ((_, product) in products.entries()) {
      categories.add(product.category);
    };
    categories.toArray();
  };

  // Admin Functions - Admin only

  public shared ({ caller }) func addProduct(
    name : Text,
    description : Text,
    price : Text,
    affiliateUrl : Text,
    imageUrl : Text,
    category : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let newProduct : Product = {
      id = nextProductId;
      name;
      description;
      price;
      affiliateUrl;
      imageUrl;
      category;
      isActive = true;
      createdAt = Time.now();
    };

    products.add(nextProductId, newProduct);
    nextProductId += 1;
    newProduct.id;
  };

  public shared ({ caller }) func updateProduct(
    id : Nat,
    name : Text,
    description : Text,
    price : Text,
    affiliateUrl : Text,
    imageUrl : Text,
    category : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    switch (products.get(id)) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?existingProduct) {
        let updatedProduct : Product = {
          id = existingProduct.id;
          name;
          description;
          price;
          affiliateUrl;
          imageUrl;
          category;
          isActive = existingProduct.isActive;
          createdAt = existingProduct.createdAt;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    switch (products.get(id)) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?_) {
        products.remove(id);
      };
    };
  };

  public shared ({ caller }) func toggleProductActive(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle product status");
    };

    switch (products.get(id)) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?existingProduct) {
        let updatedProduct : Product = {
          id = existingProduct.id;
          name = existingProduct.name;
          description = existingProduct.description;
          price = existingProduct.price;
          affiliateUrl = existingProduct.affiliateUrl;
          imageUrl = existingProduct.imageUrl;
          category = existingProduct.category;
          isActive = not existingProduct.isActive;
          createdAt = existingProduct.createdAt;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  // User Profile Functions

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
