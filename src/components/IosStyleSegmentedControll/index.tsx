import React, {useState} from "react";
import './index.css'

type IosStyleSegmentedControllPropType = {
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