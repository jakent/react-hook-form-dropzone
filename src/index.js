import "./styles.css";
import React from "react";
import ReactDOM from "react-dom";
import {findFileExtension} from "./tools";
import {useDropzone} from "react-dropzone";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {HelpOutline, HighlightOff} from "@material-ui/icons";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import {useFieldArray, useForm} from "react-hook-form";
import IconButton from "@material-ui/core/IconButton";


function App() {
  const methods = useForm();
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "files"
  });

  const {getInputProps, getRootProps} = useDropzone({
    onDrop: files => files.forEach(file => append({
      name: file.name,
      preview: URL.createObjectURL(file),
      extension: findFileExtension(file),
      file: file,
    })),
  });

  const submit = data => {
    console.log("submitted data", data, fields);
    console.log("this should be defined", data.files[0].file.name, fields[0].file.name)
  };

  return (
    <form onSubmit={methods.handleSubmit(submit)}>
      {fields.map((f, index) => (
        <Box
          display={"flex"}
          alignItems={"center"}
          key={f.name}
        >
          <Avatar alt={f.name} src={f.preview}>
            {f.extension ?? <HelpOutline/>}
          </Avatar>
          <Box m={1}>{f.name}</Box>
          <TextField
            variant={"filled"}
            label={"Metadata"}
            name={`files[${index}].metadata`}
            inputRef={methods.register({required: "this is required"})}
            error={Boolean(methods.errors.files
              && methods.errors.files[index]
              && methods.errors.files[index].metadata)}
            helperText={methods.errors.files
            && methods.errors.files[index]
            && methods.errors.files[index].metadata.message}
          />
          <input type={"hidden"} name={`files[${index}].file`} ref={methods.register()} defaultValue={f.file}/>
          <input type={"hidden"} name={`files[${index}].name`} ref={methods.register()} defaultValue={f.name}/>

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

      <div {...getRootProps()}>
        <input {...getInputProps()}/>
        <Typography variant="body1" fontWeight="bold">
          Drag and drop files here or
        </Typography>
        <Button color="primary">
          Click Here to Upload
        </Button>
      </div>

      <input type={"submit"} disabled={fields.length === 0}/>
    </form>
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
