import React, { useEffect, useState } from "react";
import { Modal, Backdrop, Box, Fade, Button} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material";
import instance from "../../API/api";

export default function Colabs ({ show, setShow, handleClose, flowId }) {

  const [allColabs, setAllColabs] = useState(null);
  const [rerender, setRerender] = useState(false);
  const [colabInput, setColabInput] = useState("");

  useEffect(() => {
    if(show) {
      instance.get(`/flows/get-colab-list?id=${flowId}`).then((res) => {
        const new_array = new Array(res.data.length);
        for(let i = 0; i < res.data.length; i++) {
          new_array[i] = {
            email: res.data[i],
            type: "original",
          }
        }
        setAllColabs(new_array);
      }).catch((e) => {
        console.log('wrong:', e)
      })
    }
    setColabInput("");
  }, [show])

  const handleSubmit = async () => {
    instance.post('/flows/revise-colab-list', { colabs: allColabs, id: flowId }).then((res) => {
      if(res.status === 200) {
        console.log('successful!')
        setShow(false);
      }
    })
  }

  return (
    <StyledModal
      open={show}
      onClose={handleClose}
      closeAfterTransition
    >
      <Fade in={show}>
        <ModalContent style={{justifyContent: 'center'}}>
          { allColabs === null ? 
          <h2>載入中⋯</h2> :
          <h2>使用者清單</h2>}
            <TextField
              margin="normal"
              // required
              fullWidth
              multiline
              name="colabs"
              label=""
              type="text"
              id="colabs"
              size="small"
              value={colabInput}
              onChange={(e) => {
                setColabInput(e.target.value);
              }}
              onKeyDown={(e) => {
                if(e.key === 'Enter') {
                  e.preventDefault();
                  setAllColabs(state => [...state, {email: colabInput, type: "new"}]);
                  setColabInput("");
                }
              }}
              InputProps={{
                style: {
                  display: 'flex',
                  flexWrap: 'wrap',
                },
                startAdornment: allColabs === null ? undefined : (
                  allColabs.map((data, index) => {
                    return ( data.type === 'remove' ? <></> : 
                      <ColabTags id={`colab-${index}`} key={`colab-${index}`}>{data.email}
                        <div onClick={() => {
                          console.log('remove')
                          setAllColabs(state => {
                            state[index].type = 'remove';
                            return state;
                          })
                          setRerender(state => !state);
                        }}>
                          <CloseIcon/>
                        </div>
                      </ColabTags>
                    )
                  })
                ),
              }}
            />
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
              style={{
                backgroundColor: "#0e1111",
                color: "white",
                paddingTop: "2%",
                textTransform: "none",
              }}
            >
              更新清單
            </Button>
        </ModalContent>
      </Fade>
    </StyledModal>
  )
}

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled(Box)`
  background-color: #ffffff;
  padding: 16px;
  border-radius: 12px;
  width: 40%;
  height: 60%;
`;

const ColabTags = styled("div")`
  border-radius: 3px;
  background-color: #f7f9fc;
  padding: 5px 10px 5px 10px;
  margin: 5px 0 5px 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;