import { type Theme, type Components } from '@mui/material/styles';
import { grey } from '../theme';

export const feedback: Components<Theme> = {
    MuiDialog: {
        styleOverrides: {
            root: ({ theme }) => ({
                '& .MuiDialog-paper': {
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: (theme.vars || theme).palette.divider,
                },
            }),
        },
    },
    MuiLinearProgress: {
        styleOverrides: {
            root: ({ theme }) => ({
                height: 8,
                borderRadius: 8,
                backgroundColor: grey[200],
                ...theme.applyStyles('dark', {
                    backgroundColor: grey[800],
                }),
            }),
        },
    },
};
