import { Box, Button, List, ListItem, ListItemText, Divider, Modal, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState, useMemo, useEffect } from 'react';

function listService({ opcion, raiz }) {
  return (
    <Box>
      <div className="vertical_line"></div>
    </Box>
  );
}

export default listService;

listService.propTypes = {
  opcion: PropTypes.string.isRequired,
  raiz: PropTypes.string.isRequired,
};