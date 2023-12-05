import * as yup from "yup"
import { PASSWORD_PARTTERN } from "./regex-pattern"

export const LoginSchema = yup
    .object()
    .shape({
        email: yup.string().required({
            value: true,
            message: "Please enter email address!"
        }).email({
            value: true,
            message: "Please enter a valid email address!"
        }),
        password: yup.string().required({
            value: true,
            message: "Please enter password!"
        })
    })
    .required()

export const RegisterSchema = yup
    .object()
    .shape({
    email: yup.string().required({
        value: true,
        message: "Please enter email address!"
        }).email({
        value: true,
        message: "Please enter a valid email address!"
        }),
    password: yup.string().required({
        value: true,
        message: "Please enter password!"
        }).min(8, {
        value: 8,
        message: "Password must be at least 8 characters!"
        }).matches(
        PASSWORD_PARTTERN,
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number!"
        ),
    confirmPassword: yup.string().required({
        value: true,
        message: "Please enter confirm password!"
        }).oneOf([yup.ref('password')], {
        value: true,
        message: "Confirm password does not match!"
        })
    })
    .required()


export const ForgotPasswordSchema = yup
    .object()
    .shape({
        email: yup.string().required({
        value: true,
        message: "Please enter email address!"
        }).email({
        value: true,
        message: "Please enter a valid email address!"
        })
    })
    .required()


export const ResetPasswordSchema = yup
    .object()
    .shape({
        password: yup.string().required({
            value: true,
            message: "Please enter password!"
        }).min(8, {
            value: 8,
            message: "Password must be at least 8 characters!"
        }).matches(
            PASSWORD_PARTTERN,
            "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number!"
        ),
        confirmPassword: yup.string().required({
            value: true,
            message: "Please enter confirm password!"
        }).oneOf([yup.ref('password')], {
            value: true,
            message: "Confirm password does not match!"
        })
    })
    .required()