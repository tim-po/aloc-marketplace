import React, {useContext, useState} from "react";
import texts from './localization'
import LocaleContext from "../../Standard/LocaleContext";
import {localized} from "../../Standard/utils/localized";
import './index.css'

// CONSTANTS

// DEFAULT FUNCTIONS

// TODO: copy this components directory and add your content to make your page

type IosStyleSegmentedControllPropType = {
    // You should declare props like this, delete this if you don't need props
    width: number;
    buttons: string[];
    firstSelectedIndex: number;
    onChange: (buttonIndex: number) => void;
}

const IosStyleSegmentedControll = (props: IosStyleSegmentedControllPropType) => {
    const { width, buttons, firstSelectedIndex, onChange } = props;
    const buttonWidthInPercent = 100 / buttons.length;
    const [selectedButton, setSelectedButton] = useState<number>(firstSelectedIndex);

    const onButtonClick = (index: number) => {
        // @ts-ignore
        setSelectedButton(index);
        // @ts-ignore
        onChange(index);
    };

    return (
        <div className={'IosStyleRadioButton'} style={{ width }}>
            <div
                className={'selector-bg'}
                style={{
                    width: `calc(${buttonWidthInPercent}% - 4px)`,
                    left: `calc(${selectedButton * buttonWidthInPercent}% + 2px)`,
                }}
            />
            {buttons.map((buttonTitle, index) => {
                return (
                    <button
                        key={buttonTitle}
                        type="button"
                        value={index}
                        onClick={() => onButtonClick(index)}
                        className={`selectableButton ${
                            selectedButton === index && 'selectableButtonSelected'
                        }`}
                        style={{ width: `${buttonWidthInPercent}%` }}
                    >
                        {buttonTitle}
                    </button>
                );
            })}
        </div>
    );
};

export default IosStyleSegmentedControll