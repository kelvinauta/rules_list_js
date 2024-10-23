# rules_list

Create an easily readable list of rules to validate before proceeding with the execution of the rest of the code.

# Usage

```js
import Rules from "rules_list";
const rules = new Rules().build();
const x = "a string";

// Easily readable list of rules
rules(
    ["The variable x must be a string", typeof x !== "string"],
    ["The variable x must be longer than 5 characters", x.length > 5],
    ["The variable x must be shorter than 10 characters", x.length < 10],
    ["The variable x must start with the letter a", x.startsWith("a")],
    ["The variable x must end with the letter g", x.endsWith("g")],
)
```