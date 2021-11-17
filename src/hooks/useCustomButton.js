import { makeStyles } from "@material-ui/core/styles";

export const useCustomButton = (props) => {
    const classes = makeStyles({
        buttonConfig: {
            position: 'absolute',
            top: `${props.top}`,
            right: `${props.right}`,
            left: `${props.left}`,
            bottom: `${props.bottom}`
        }
    })
    return classes;
}