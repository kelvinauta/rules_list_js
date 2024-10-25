import chalk from 'chalk';



class CustomError {
    constructor(message) {
        this.message = message;
        this.stack = new Error(message).stack;
     
    }
    get_message() {
        const message = this.message;
        const stack_parsed = this._get_stack_parsed(this.stack);
        let error_message = "";
        error_message+=chalk.magenta("\nStack trace:");
        error_message+=`\n${stack_parsed}`;
        error_message+=chalk.magenta("\nError message:");
        error_message+=`\n ${message.replaceAll('\n', '\n ')}`; // indent the message
        return error_message;
    }
    error_generator() {
        return (message) => new CustomError(message).get_message();
    }
    _get_stack_parsed(stack) {
        
        const offset_stack = 2;
        const cut_stack_match = "CustomError";

        let stackArray = stack.split('\n');
        let cutIndex = stackArray.findIndex(line => line.includes(cut_stack_match));
        let cut_stack = stackArray.slice(cutIndex + 1 + offset_stack);

        // parse stack
        let stack_parsed = [];
        for(const line of cut_stack){ 
            let parsed_line = line;
            const regex_path = /\((.*?)\)/;
            const match = line.match(regex_path);
            if (match) {
                const path_with_line = match[1];
                const array_path_with_line = path_with_line.split(':');
                const path = array_path_with_line[0];
                const line = array_path_with_line.slice(1).join(':');
                if(!path) continue;
                if(!line) continue;
                parsed_line = ` ${chalk.magenta(line)} ${path}`;
            }
            stack_parsed.push(parsed_line);
        }
        stack_parsed = stack_parsed.join('\n');
        return stack_parsed;
    }
}

export default CustomError;