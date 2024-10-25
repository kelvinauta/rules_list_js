import CustomError from './CustomError.js';
import chalk from 'chalk';
const error = new CustomError().error_generator();
const COLOR_OPTIONS = Object.getOwnPropertyNames(Object.getPrototypeOf(chalk))
    .filter((method)=>{
        const black_list = ["constructor", "prototype", "level", "enabled"];
        return !black_list.includes(method);
    });
class Rules {
    constructor(prefix, color) {
        // validate options
        if(!prefix) throw new Error('Prefix is required');
        this._constructor_validator(prefix, color);
       
        // logic
        this.color = color;
        this.prefix = prefix;
        this.prefixes_with_color = [];
        this._add_prefix(prefix);

      
    }
    build(){
        // handler rules or generate a new rules instance
       
        return (...options) => {
            const rules = this;
            function is_new_instance(...options){
                if(!options) return false;
                if(!Array.isArray(options)) return false;
                if(!(options.length === 1 || options.length === 2)) return false;
                if(typeof options[0] !== 'string') return false;
                
                if(options[1]){ // color validator
                    if(typeof options[1] !== 'string') return false;
                    if(options[1].length === 0) return false;
                    const color_options = COLOR_OPTIONS;
                    if(!color_options.includes(options[1])) return false;
                }
    
                try{
                    if(rules._constructor_validator(...options)) return true;
             
                }catch(e){
                    return false;
                }
            }
            function is_handler_checker(...options){
                try{
                    rules._rules_validator(options);
                    return true;
                }catch(e){
                    return false;
                }   
            }
   
            if(is_new_instance(...options)) return this._rules_generator(...options);
            if(is_handler_checker(...options)) return this._handler_checker(...options);
            let error_message = chalk.magenta(`Module Rules ERROR:`);
            error_message += `\nInvalid options ${chalk.inverse.underline(` ${options} `)} only new instance or handler checker are allowed`;
            error_message += chalk.bold(`\nnew instance example:`);
            error_message += `\nrules("prefix", "color")`;
            error_message += chalk.bold(`\nhandler checker example:`);
            error_message += `\n rules([`;
            error_message += `\n  ["message1", condition1],`;
            error_message += `\n  ["message2", condition2],`;
            error_message += `\n ])`;
         
            throw error(error_message);
        }
    }

    _add_prefix(prefix){
        // validate
        if(!prefix) throw new Error('Prefix is required');
        if(typeof prefix !== 'string') throw new Error('Prefix must be a string');
        // logic
        let prefix_with_color = prefix;
        if(this.color) prefix_with_color = chalk[this.color](prefix);
        this.prefixes_with_color.push(prefix_with_color);
    }
    _rules_generator(prefix, color){
       
        const old_rules = this;
        const new_rules = new Rules(prefix, color);
        new_rules.prefixes_with_color = [
            ...old_rules.prefixes_with_color, 
            ...new_rules.prefixes_with_color
        ];
        return new_rules.build();
     }
    _handler_checker(...rules){
        // validate rules
        this._rules_validator(rules);

        // logic
        const checker = this._rules_checker(rules);
   
        if(checker.is_error){
            const message = this._build_message(checker.message, this.prefixes_with_color);
            throw error(message);
        }

    }

    _rules_checker(rules){
        // validate rules
        this._rules_validator(rules);
        // logic
        let checker = {
            is_error: false,
            message: ""
        };
        rules.forEach(([message, condition], index) => {
            if (!condition) return;
            checker = {
                is_error: true,
                message: checker.message + `\n- ${message}`
            };
        });
        if(this.color) checker.message = chalk[this.color](checker.message);
        return checker;
    }
    _rules_validator(rules){
        if(!rules) throw new Error('Rules is required');
        if(!Array.isArray(rules)) throw new Error(`Rules must be an array`);
        if(rules.some(item => !Array.isArray(item))) throw new Error(`Rules must be an array of arrays`);
        if(rules.some(item => typeof item[0] !== 'string')) throw new Error(`Rules[0] must be a string ${rules}`);
        if(rules.some(item => typeof item[1] !== 'boolean')) throw new Error(`Rules[1] must be a boolean`);
    }
    _build_message(message, prefixes){
        // validate
        if(!message) throw new Error('Message is required');
        if(prefixes !== undefined){
            if(!Array.isArray(prefixes)) throw new Error('Prefixes must be an array');
            if(prefixes.length === 0) throw new Error('Prefixes must be an array with at least one item');
            if(prefixes.some(item => typeof item !== 'string')) throw new Error('Prefixes must be an array of strings');
        }
        
        // logic
        let prefix = prefixes !== undefined ? `${prefixes.join('')} ` : '';
        return `${prefix}${message}`;
    }
    _constructor_validator(prefix, color, prefixes_with_color){
        // validate prefix
        if(prefix !== undefined){
            
            if(typeof prefix !== 'string') throw new Error('Prefix must be a string');
        }
        // validate color
        if(color !== undefined){
            if(typeof color !== 'string') throw new Error('Color must be a string');
            const color_options= COLOR_OPTIONS;
            if(!color_options.includes(color)) throw new Error(`Color must be one of the following: ${color_options.join(', ')}`);     
        }

        // validate prefixes with color
        if(prefixes_with_color !== undefined){
            if(!prefixes_with_color) throw new Error('Prefixes with color is required');
            if(!Array.isArray(prefixes_with_color)) throw new Error('Prefixes with color must be an array');
            if(prefixes_with_color.length === 0) throw new Error('Prefixes with color must be an array with at least one item');
            if(prefixes_with_color.some(item => typeof item !== 'string')) throw new Error('Prefixes with color must be an array of strings');
        }

        return true;
    }
   


}

export default Rules;