import React, { useEffect, useState } from 'react';
import './Sidebar.scss';
import { FaPen, FaBook, FaCalendarAlt } from 'react-icons/fa';
import { AiTwotoneSetting } from 'react-icons/ai';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useFlowStorage } from '../../storage/Storage';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { t } = useTranslation();
  const changeMode = useFlowStorage((state) => state.changeMode);
  const mode = useFlowStorage((state) => state.mode);
  const tabList = useFlowStorage((state) => state.tabList);
  const location = useLocation();
  const SideBarItem = styled(Box)(({ theme }) => ({
    cursor: 'pointer',
    color: 'white',
    backgroundColor: 'black',
    width: '70%',
    height: '8px',
    marginTop: '10px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopRightRadius: '50px',
    borderBottomRightRadius: '50px',
  }));
  const SideBarText = styled('div')(() => ({
    lineHeight: '2',
    width: '55%',
  }));
  useEffect(() => {
    const all = document.querySelectorAll('.sidebar-item');
    for (let index = 0; index < all.length; index++) {
      // 按鈕顏色互斥
      if (index === mode) {
        all[index].style.backgroundColor = 'white';
        all[index].style.color = 'black';
        // all[index].firstChild.style.color = "black";
      }
    }
  }, [mode, tabList, location, t]);
  return (
    <Stack className='sidebar'>
      <a className='logo' href='/home'>
        <img src='assets/logo.png' alt='' width='60' height='60' />
      </a>
      <SideBarItem className='sidebar-item' onClick={() => changeMode(0)}>
        <FaPen size={20} style={{ width: '45%' }} />
        <SideBarText>{t('Flows')}</SideBarText>
      </SideBarItem>
      <SideBarItem className='sidebar-item' onClick={() => changeMode(1)}>
        <FaBook size={20} style={{ width: '45%' }} />
        <SideBarText>{t('Library')}</SideBarText>
      </SideBarItem>
      <SideBarItem className='sidebar-item' onClick={() => changeMode(2)}>
        <FaCalendarAlt size={20} style={{ width: '45%' }} />
        <SideBarText>{t('Calendar')}</SideBarText>
      </SideBarItem>
      <SideBarItem className='sidebar-item' onClick={() => changeMode(3)}>
        <AiTwotoneSetting size={20} style={{ width: '45%' }} />
        <SideBarText>{t('Settings')}</SideBarText>
      </SideBarItem>
    </Stack>
  );
};

export default Sidebar;
