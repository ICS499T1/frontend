import { makeStyles } from "@material-ui/core/styles";

export const useImageBackgroundStyle = ({ imageUrl }) => {
    const classes = makeStyles({
        paperContainer: {
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: 'center', 
            backgroundSize: 'cover', 
            backgroundRepeat: 'no-repeat',
            // margin: 'auto',
            height: '25vh',
            width: 'calc(20vw * 0.54 - 2%)',
            borderRadius: 8,
            display: 'flex',
            marginLeft: '10px',
            marginTop: '10px'
        }
    })
    return classes()
  }

// export const useImageBackgroundStyle = makeStyles({
//     paperContainer: {
//         backgroundImage: `url(${background})`
//     }
//   });