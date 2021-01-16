import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function Chooser(props) {
  const classes = useStyles();
  const [age, setAge] = React.useState("");
  const handleChange = (event) => {
    setAge(event.target.value);
    console.log(age);
    props.handle(event.target.value);
  };
  const list = props.list;
  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-filled-label">
          {props.label}
        </InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={age}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>Všechny</em>
          </MenuItem>
          {list.map((object, i) => (
            <MenuItem value={object.value} key={i}>
              {object.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
