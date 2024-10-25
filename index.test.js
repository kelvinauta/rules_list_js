import { test, expect } from "bun:test";
import Rules from "./src/index.js";
import chalk from 'chalk';

test("Debe construir correctamente con opciones por defecto", () => {
    const rules = new Rules("prefix");
    expect(rules).toBeInstanceOf(Rules);
    expect(rules.prefix).toBe("prefix");
    expect(rules.color).toBeUndefined();
});

test("Debe lanzar un error si las opciones no son válidas", () => {
    expect(() => new Rules()).toThrow("Prefix is required");
    expect(() => new Rules(123)).toThrow("Prefix must be a string");
    expect(() => new Rules("prefix", "invalidColor")).toThrow("Color must be one of the following:");
});

test("Debe generar una nueva instancia de Rules correctamente", () => {
    const rules = new Rules("prefix");
    const newRules = rules.build()("newPrefix", "red");
    expect(newRules).toBeInstanceOf(Function);
    const result = newRules(["Test message", false]);
    expect(result).toBeUndefined();
});


test("Debe validar correctamente los prefijos", () => {
    expect(() => new Rules("")).toThrow("Prefix is required");
    expect(() => new Rules(null)).toThrow("Prefix is required");
    expect(() => new Rules(undefined)).toThrow("Prefix is required");
});

test("Debe validar correctamente los colores", () => {
    expect(() => new Rules("prefix", "invalidColor")).toThrow("Color must be one of the following:");
    expect(() => new Rules("prefix", "red")).not.toThrow();
});

test("Debe arrojar error correctamente", () => {
    const rules = new Rules("prefix", "red");
    const validate = rules.build();
    expect(() => validate(
        ["Error message", true],
        ["Error message 2", true],
        ["Error message 3", true],
        ["Error message 4", false],
    )).toThrow();
});
test("Debe contruir el error correctamente", () => {
    const rules = new Rules("prefix", "red");
    const validate = rules.build();
    try {
        validate(
            ["Error message", true],
            ["Error message 2", true],
            ["Error message 3", true],
            ["Error message 4", false],
        );
    } catch (error) {
        const errorMessage = error.toLowerCase();
        expect(errorMessage).toContain("stack trace");
        expect(errorMessage).toContain("error message");
        expect(errorMessage).toContain("error message");
        expect(errorMessage).toContain("error message 2");
        expect(errorMessage).toContain("error message 3");
        expect(errorMessage).not.toContain("error message 4");
    }
});

test("Debe manejar múltiples prefijos correctamente", () => {
    const rules = new Rules("prefix1");
    const validate = rules.build()("prefix2", "blue")("prefix3", "green")("prefix4")("prefix5", "bold");
    try {
        validate(["Error message", true]);
    } catch (error) {
        const prefix = `prefix1${chalk.blue("prefix2")}${chalk.green("prefix3")}prefix4${chalk.bold("prefix5")}`;
        expect(error).toContain(prefix);
    }
});


test("Debe lanzar errores apropiados para entradas inválidas en el método build", () => {
    const rules = new Rules("prefix");
    const validate = rules.build();
    expect(() => validate(4)).toThrow();
    expect(() => validate(["invalid"])).toThrow();
    expect(() => validate(["message", "notBoolean"])).toThrow();
    expect(() => validate({})).toThrow();
    expect(() => validate(null)).toThrow();
    expect(() => validate(undefined)).toThrow();
    expect(() => validate(true)).toThrow();
    expect(() => validate([])).toThrow();
    expect(() => validate(new Date())).toThrow();
    expect(() => validate(() => {})).toThrow();
});

