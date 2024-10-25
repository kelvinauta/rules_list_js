# rules_list

`rules_list` is a JavaScript library that allows you to create easily readable rule lists for validating conditions before executing the rest of your code.

## Main Feature

Easily readable rules (or validations). 

Normally, when validating, we use `if(condition)` and then the error message for the validation. It's more convenient to first read the error message and then the condition, so we explicitly know what the error is without trying to deduce the logic of the condition in question. `rules_list` allows you to read from left to right so that in a more natural and readable way, you can first read the message of what the necessary validation is and then the logic of the conditional.

## Basic Usage

```javascript
import Rules from "rules_list";
const rules = new Rules("the_rules").build();

const x = "a string";
// Easily readable rule list
rules(
    ["Variable x must be a string", typeof x !== "string"],
    ["Variable x must be longer than 5 characters", x.length <= 5],
    ["Variable x must be shorter than 10 characters", x.length >= 10],
    ["Variable x must start with the letter 'a'", !x.startsWith("a")],
    ["Variable x must end with the letter 'g'", !x.endsWith("g")]
);
```

## Features

- Create easily readable rule lists
- Support for rule nesting
- Each nesting can have its own custom color
- Pretty and easy-to-read errors when a rule is not met

## API

### `Rules` Class

#### Constructor

```javascript
new Rules(prefix, color)
```

- `prefix`: (String, required) Prefix for error messages
- `color`: (String, optional) Color for error messages (must be a valid chalk color)

#### `build()` Method

Builds and returns a function that can be used to create new rule instances or to check rules.

### Rules Function

```javascript
const rules = new Rules("the_rules").build();
rules( // the_rules ...errors
    ["message1", condition1],
    ["message2", condition2],
    ["message3", condition3],
)
// In rules, you can set your list of rules
// or create a new nested instance, such as:
const section_A = rules(".section(A)");
section_A( // the_rules.section(A) ...errors
    ["message4", condition4],
    ["message5", condition5],
    ["message6", condition6],
)
const article_1 = section_A(".article(1)");
article_1( // the_rules.section(A).article(1) ...errors
    ["message7", condition7],
    ["message8", condition8],
    ["message9", condition9],
)
```
If the parameters of rules are a list of arrays
`["message", condition]`
You will be validating that list of rules.
If the parameters are a prefix (string), then you will get a new instance of rules with the prefixes of its predecessors (it's basically like creating a new `build()`).

## Advanced Examples

### Rule Nesting

```javascript
import Rules from "rules_list";
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
    try {
      this.validateUser(user);
      console.log("User registration successful!");
      // Proceed with user registration...
    } catch (error) {
      console.error("User registration failed:");
      console.error(error.message);
    }
  }
}
// Usage
const registration = new UserRegistration();
registration.register({
  name: "John Doe",
  email: "johndoe@example.com",
  password: "weakpass",
});

```

## Error Handling

When a rule fails, a custom error is thrown with a formatted message and a stack trace. The error will look similar to this:

```
error: 
Stack trace:
 12:9 /path/to/file/test.js
 30:9 /path/to/file/test.js
Error message:
 Example.execute 
 - x must be a number
 - x must be a boolean
 - x must be an object
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
