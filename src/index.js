import "./styles.css";
import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import {findFileExtension} from "./tools";
import Box from "@material-ui/core/Box";
import {HighlightOff} from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import {useFieldArray, useForm} from "react-hook-form";
import IconButton from "@material-ui/core/IconButton";


function App() {
  const {setValue, control, register, handleSubmit, errors, watch, getValues} = useForm();
  const {fields, remove} = useFieldArray({control, name: "files"});
  const watchedFiles = watch('files', []);

  const handleChange = (e) => {
    const file = e.target.files[0]; // only taking one file for the time being
    const transformed = [{
      name: file.name,
      preview: URL.createObjectURL(file),
      extension: findFileExtension(file),
      file: file,
    }];
    console.log("handleChange", transformed)
    setValue('files', transformed);
  };

  useEffect(() => {
    register({name: "files"}, {required: true}) // still have validation for required
  }, [register]);

  const submit = data => {
    console.log("submitted data", data);
    console.log("this should be defined", data.files[0].file.name)
  };

  console.log("watchedFiles", watchedFiles, "fields", fields, "getValues", getValues())

  return (
    <form onSubmit={handleSubmit(submit)}>
      {watchedFiles.map((f, index) => (
        <Box
          display={"flex"}
          alignItems={"center"}
          key={f.name}
        >
          {/*<Avatar alt={f.file.name} src={f.preview}>*/}
          {/*  {f.extension ?? <HelpOutline/>}*/}
          {/*</Avatar>*/}
          <TextField
            variant={"filled"}
            label={"Name"}
            name={`files[${index}].name`}
            inputRef={register({required: "this is required"})}
          />
          <TextField
            variant={"filled"}
            label={"Metadata"}
            name={`files[${index}].metadata`}
            inputRef={register({required: "this is required"})}
            error={Boolean(errors.files
              && errors.files[index]
              && errors.files[index].metadata)}
            helperText={errors.files
              && errors.files[index]
              && errors.files[index].metadata
              && errors.files[index].metadata.message}
          />
          <input type={"hidden"} name={`files[${index}].file`} ref={register()}/>

          <Box color={"error.main"}>
            <IconButton
              color="inherit"
              onClick={() => remove(index)}
            >
              <HighlightOff/>
            </IconButton>
          </Box>
        </Box>
      ))}

      <input
        type={"file"}
        name={"files"}
        multiple
        onChange={handleChange}
      />

      <input type={"submit"} disabled={watchedFiles.length === 0}/>
    </form>
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
