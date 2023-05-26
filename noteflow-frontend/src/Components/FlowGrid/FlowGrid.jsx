import React, { useEffect, useState, useRef } from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Menu from '@mui/material/Menu';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useNavigate } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import instance from '../../API/api';
import { useApp } from '../../hooks/useApp';
import { useTranslation } from 'react-i18next';
import { usePageTab } from '../../hooks/usePageTab';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import BackToTopButton from '../BackToTopButton/BackToTopButton';
import './FlowGrid.scss';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FlowGrid({ containerRef }) {
  const { t, i18n } = useTranslation();
  const { isMobile, user } = useApp();
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isChangeTitleOpen, setIsChangeTitleOpen] = useState(false);
  const [titleToBeDeleted, setTitleToBeDeleted] = useState(null);
  const [idToBeDeleted, setIdToBeDeleted] = useState(null);
  const [titleToBeChanged, setTitleToBeChanged] = useState(null);
  const [idToBeChanged, setIdToBeChanged] = useState(null);
  const [target, setTarget] = useState({});

  const navigateTo = useNavigate();
  const { tabList, addTab, deleteTab } = usePageTab();
  const loadingCheckPointRef = useRef(null);
  const FlowButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[100]),
    backgroundColor: 'white',
    border: '1px black solid',
    '&:hover': {
      backgroundColor: grey[100],
      border: '1px grey solid',
    },
    width: '100%',
    aspectRatio: '3/2',
  }));
  const options = {
    root: null,
    threshold: 0,
  };
  const fetchFlows = async () => {
    const nextPage = page + 1;
    await instance
      .get('/flows', { params: { page } })
      .then((res) => {
        if (res.status === 200) {
          if (res.data.length == 0) {
            observeforFetching.unobserve(loadingCheckPointRef.current);
          } else {
            setFlows([...flows, ...res.data]);
            setPage(nextPage);
          }
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const observeforFetching = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          await fetchFlows();
        }
      });
    }, options);
    let loadingCheckPointEle = loadingCheckPointRef.current;
    if (loadingCheckPointEle) observeforFetching.observe(loadingCheckPointEle);

    return () => {
      let loadingCheckPointEle = loadingCheckPointRef.current;
      if (loadingCheckPointEle)
        observeforFetching.unobserve(loadingCheckPointEle);
    };
  }, [page, loading]);

  useEffect(() => {
    if (!user) return;
    fetchFlows();
  }, [user]);

  const toFlow = (flow) => {
    if (!tabList.find((f) => f.objectId == flow.id)) {
      addTab({
        type: 'flow',
        objectId: flow.id,
        name: flow.name ? flow.name : 'UnTitled',
      }); // name 應該在 flows/create 拿
    }
    console.log(flow);
    navigateTo(`/flow?id=${flow.id}`);
  };
  const handleCloseContextMenu = () => {
    setTarget(null);
    setIsMenuOpen(null);
  };

  const openAlert = (id, title) => {
    setTitleToBeDeleted(title);
    setIdToBeDeleted(id);
    setIsAlertOpen(true);
    setIsMenuOpen(null);
  };

  const openChangeTitle = (id, title) => {
    setTitleToBeChanged(title);
    setIdToBeChanged(id);
    setIsChangeTitleOpen(true);
    setIsMenuOpen(null);
  };
  const closeAlert = () => {
    setTitleToBeDeleted(null);
    setIdToBeDeleted(null);
    setIsAlertOpen(false);
    console.log('Cancel Delete Flow');
  };

  const closeChangeTitle = () => {
    setTitleToBeChanged(null);
    setIdToBeChanged(null);
    setIsChangeTitleOpen(false);
    // console.log("Cancel Delete Flow");
  };

  const deleteFlow = (id) => {
    // flowdd = 'yuti@gmail.com-flow-1b6837f7-10d3-4501-9d9c-f5ad8be24f17';
    setTitleToBeDeleted(null);
    setIdToBeDeleted(null);
    setIsAlertOpen(false);

    instance
      .post('/flows/delete-flow', { id })
      .then((res) => {
        console.log('Delete Flow Success');
        // console.log(flows.filter((flow) => flow.id !== id));
        setFlows(flows.filter((flow) => flow.id !== id));
      })
      .catch((e) => {
        console.log(e);
      });

    if (tabList.find((f) => f.objectId == id)) {
      deleteTab(id);
    }
  };

  const changeTitle = (id, title) => {
    instance
      .post('flows/set-title', { id, title })
      .then((res) => {
        setFlows((fs) =>
          fs.map((flow) => {
            if (flow.id == id) {
              flow.name = title;
            }
            return flow;
          }),
        );
        setTitleToBeChanged(null);
        setIdToBeChanged(null);
        setIsChangeTitleOpen(false);
        console.log('Change Title Success');
      })
      .catch((e) => {
        console.log(e);
      });
    //change Title API
  };
  document.addEventListener('click', () => {
    setIsMenuOpen(null);
  });
  return loading ? (
    <LoadingScreen />
  ) : (
    <>
      {isAlertOpen || isChangeTitleOpen ? (
        isAlertOpen ? (
          <Dialog
            open={isAlertOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={closeAlert}
          >
            <DialogTitle>
              {t('Do you want to delete the follow ') + titleToBeDeleted + '?'}
            </DialogTitle>
            <DialogActions>
              <Button onClick={() => deleteFlow(idToBeDeleted)}>
                {t('Yes')}
              </Button>
              <Button onClick={closeAlert}>{t('Cancel')}</Button>
            </DialogActions>
          </Dialog>
        ) : (
          <Dialog
            open={isChangeTitleOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={closeChangeTitle}
            fullWidth="true"
            maxWidth="sm"
          >
            <DialogTitle>{t('Change Name')}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                fullWidth
                variant="standard"
                label={t('Flow Name')}
                multiline
                value={titleToBeChanged}
                onChange={(event) => {
                  setTitleToBeChanged(event.target.value);
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  console.log(titleToBeChanged);
                  changeTitle(idToBeChanged, titleToBeChanged);
                }}
              >
                {t('Confirm')}
              </Button>
              <Button onClick={closeChangeTitle}>{t('Cancel')}</Button>
            </DialogActions>
          </Dialog>
        )
      ) : (
        <div
          className={`${isMobile ? 'flow-container-mobile' : 'flow-container'}`}
        >
          {flows.map((flow, key) => {
            const date = new Date();
            date.setTime(flow.updateAt);
            const formattedDate = date.toLocaleString();
            return (
              <ClickAwayListener onClickAway={handleCloseContextMenu} key={key}>
                <div className="grid-item" key={key}>
                  <div
                    className="grid-item"
                    onContextMenu={(event) => {
                      setTarget(event.currentTarget);
                      setIsMenuOpen(flow.id);
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    key={key}
                  >
                    <FlowButton
                      onClick={() => toFlow(flow)}
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                    >
                      {flow.thumbnail !== '' ? (
                        <img
                          style={{ objectFit: 'cover' }}
                          loading="lazy"
                          alt="flow.thumbnail"
                        />
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Typography>{t('Last Edit Time:')}</Typography>
                          <Typography>{formattedDate}</Typography>
                        </div>
                      )}
                    </FlowButton>
                    <Typography>{flow.name}</Typography>
                    <Menu
                      // autoFocusItem={open}
                      open={isMenuOpen == flow.id}
                      anchorEl={target}
                      anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          openChangeTitle(flow.id, flow.name);
                        }}
                      >
                        {t('Rename')}
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          openAlert(flow.id, flow.name);
                        }}
                      >
                        {t('Delete')}
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              </ClickAwayListener>
            );
          })}

          {containerRef?.current && (
            <BackToTopButton containerRef={containerRef} />
          )}

          <div
            className="loading-checkpoint"
            ref={loadingCheckPointRef}
            style={{ visibility: 'hidden' }}
          >
            CHECKPOINT
          </div>
        </div>
      )}
    </>
  );
}
