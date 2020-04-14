import "./styles.css";
import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {findFileExtension} from "./tools";
import {useDropzone} from "react-dropzone";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {HelpOutline} from "@material-ui/icons";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import {useForm} from "react-hook-form";


function App() {
  const [files, setFiles] = useState([]);
  const methods = useForm();

  const {getInputProps, getRootProps} = useDropzone({
    onDrop: files => setFiles(files.map(file => ({
      name: file.name,
      preview: URL.createObjectURL(file),
      extension: findFileExtension(file),
      file: file,
    }))),
  });

  useEffect(() => {
    if (files.length > 0) {
      console.log("resetting", files);
      methods.setValue("files", files);
      // methods.reset({
      //   files: files,
      // });
    }
  }, [files.length]); // eslint-disable-line

  const submit = data => {
    console.log("submitted data", data);
    console.log("this should be defined", data.files[0].file.name)
  }

  return (
    <form onSubmit={methods.handleSubmit(submit)}>
      {files.map((f, index) => (
        <Box
          display={"flex"}
          alignItems={"center"}
          key={f.file.name}
        >
          <Avatar alt={f.file.name} src={f.preview}>
            {f.extension ?? <HelpOutline/>}
          </Avatar>
          <Box m={1}>{f.file.name}</Box>
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
          <input type={"hidden"} name={`files[${index}].file`} ref={methods.register()}/>
          <input type={"hidden"} name={`files[${index}].name`} ref={methods.register()}/>
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

      <input type={"submit"} disabled={files.length === 0}/>
    </form>
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
