import Rules from "./index";
class UserRegistration {
  constructor() {
    this.rules = new Rules("UserRegistration", "cyan").build();
  }
  validateUser(user) {
    const rules = this.rules(".validateUser", "green");
    rules(
      ["User object must be provided", !user],
      ["User must have a name", !user.name],
      ["User must have an email", !user.email],
      ["User must have a password", !user.password]
    );
    this.validateName(user.name);
    this.validateEmail(user.email);
    this.validatePassword(user.password);
  }
  validateName(name) {
    const rules = this.rules(".validateName", "blue");
    rules(
      ["Name must be a string", typeof name !== "string"],
      ["Name must be at least 2 characters long", name.length < 2],
      ["Name must be at most 50 characters long", name.length > 50],
      ["Name must only contain letters and spaces", !/^[a-zA-Z\s]+$/.test(name)]
    );
  }
  validateEmail(email) {
    const rules = this.rules(".validateEmail", "magenta");
    rules(
      ["Email must be a string", typeof email !== "string"],
      ["Email must be valid", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)]
    );
  }
  validatePassword(password) {
    const rules = this.rules(".validatePassword", "yellow");
    rules(
      ["Password must be a string", typeof password !== "string"],
      ["Password must be at least 8 characters long", password.length < 8],
      [
        "Password must contain at least one uppercase letter",
        !/[A-Z]/.test(password),
      ],
      [
        "Password must contain at least one lowercase letter",
        !/[a-z]/.test(password),
      ],
      ["Password must contain at least one number", !/[0-9]/.test(password)],
      [
        "Password must contain at least one special character",
        !/[!@#$%^&()+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      ]
    );
  }
  register(user) {
    this.validateUser(user);
    console.log("User registration successful!");
  }
}
// Usage
const registration = new UserRegistration();

// Valid Registration
registration.register({
  name: "Kelvin Auta",
  email: "kelvinauta@example.com",
  password: "StrongPass123!",
});

// Invalid Registration
registration.register({
  name: "John Doe",
  email: "johndoe@example.com",
  password: "weakpass",
});
 