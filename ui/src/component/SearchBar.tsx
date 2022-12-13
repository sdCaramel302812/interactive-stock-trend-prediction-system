import { IconButton, Paper } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

function SearchBar() {
  return (
    <div>
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        style={{ borderRadius: '5px', backgroundColor: '#fafafa' }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="S&P 500"
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      
    </div>
  );
}

export default SearchBar;