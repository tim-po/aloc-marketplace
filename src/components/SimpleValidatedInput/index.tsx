import React, {useContext, useState} from "react";
import texts from './localization'
import LocaleContext from "../../Standard/LocaleContext";
import {localized} from "../../Standard/utils/localized";
import './index.css'

// CONSTANTS

// DEFAULT FUNCTIONS

// TODO: copy this components directory and add your content to make your page

type SimpleValidatedInputPropType = {
    // You should declare props like this, delete this if you don't need props
    placeholder?: string
    className?: string
    type?: string
    shouldValidateOnInput?: boolean
    errorTooltipText?: string
    validationFunction?: (text: string) => boolean
    onValidationChange: (isValid: boolean) => void
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
    onFocus?: (e: React.FocusEvent) => void
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}


const SimpleValidatedInputDefaultProps = {
    // You should declare default props like this, delete this if you don't need props
    placeholder: '',
    type: 'text',
    errorTooltipText: 'Wrong input',
    className: '',
    shouldValidateOnInput: false,
    onValidationChange: ()=>{},
    validationFunction: ()=>{return true},
    onBlur: ()=>{},
    onFocus: ()=>{},
    onChange: ()=>{},
}

const SimpleValidatedInput = (props: SimpleValidatedInputPropType) => {
    const {placeholder, type, className, shouldValidateOnInput, onValidationChange, errorTooltipText, validationFunction, onBlur, onChange, onFocus} = props
    const [isValid, setIsValid] = useState(true)

    const onChangeInner = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e)
        }
        if(validationFunction && validationFunction(e.target.value)){
            setIsValid(true)
            onValidationChange(true)
        }
        if(shouldValidateOnInput && validationFunction && !validationFunction(e.target.value)){
            setIsValid(false)
            onValidationChange(false)
        }
    }

    const onFocusInner = (e: React.FocusEvent) => {
        if (onFocus) {
            onFocus(e)
        }

    }

    const onBlurInner = (e: React.FocusEvent<HTMLInputElement>) => {
        if (onBlur) {
            onBlur(e)
        }
        if(validationFunction && !validationFunction(e.target.value)){
            setIsValid(false)
            onValidationChange(false)
        }
    }

    return (
        <div className={`relative`}>
            <input
                onChange={onChangeInner}
                onFocus={onFocusInner}
                onBlur={onBlurInner}
                className={`SimpleValidatedInput ${isValid ? '': 'not-valid'} ${className}`}
                placeholder={placeholder}
                type={type}
            />
            <div className={`validation-error-tooltip ${isValid? '': 'active'}`}>
                {errorTooltipText}
            </div>
        </div>
    )
};

SimpleValidatedInput.defaultProps = SimpleValidatedInputDefaultProps

export default SimpleValidatedInput