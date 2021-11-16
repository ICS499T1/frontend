import { makeStyles } from "@material-ui/core/styles";

export const useImageBackgroundStyle = ({ imageUrl }) => {
    const classes = makeStyles({
        paperContainer: {
            backgroundImage: `url(${imageUrl})`
        }
    })
    return classes()
  }

// export const useImageBackgroundStyle = makeStyles({
//     paperContainer: {
//         backgroundImage: `url(${background})`
//     }
//   });