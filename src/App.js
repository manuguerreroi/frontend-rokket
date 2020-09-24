import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import {
  Container,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Modal,
  Button,
  TextField,
} from "@material-ui/core";
import { Add, Delete } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const apiUrlaBase = 'http://localhost:10000/api/foods/';
const useStyles = makeStyles((theme) => ({
 
  button: {
        margin: "30px",
        padding: "10px"
    },
  modal: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  iconos: {
    cursor: "pointer",
  },
  inputMaterial: {
    width: "100%",
  },
}));

function App() {
  const styles = useStyles();
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  const [food, setFood] = useState({
    name: "",
    description: "",
  });

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };

  const getFoods = async () => {
    await axios
      .get(apiUrlaBase)
      .then((response) => setData(response.data));
  };

  useEffect(() => {
    getFoods();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFood((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const peticionPost = async () => {
    await axios
      .post(apiUrlaBase, food)
      .then((response) => {
        setData(data.concat(response.data));
        abrirCerrarModalInsertar();
      });
  };

  const seleccionarComida = (comida) => {
    setFood(comida)
    abrirCerrarModalEliminar()
  };

  const peticionDelete =  () => {

    axios.delete(apiUrlaBase+food._id)
    setData(data.filter((x) => x._id !== food._id))

    abrirCerrarModalEliminar()
    

  };

  const bodyEliminar = (
    <div className={styles.modal}>
      <p>
        ¿Estás seguro que deseas eliminar <b>{food.name}</b> ?{" "}
      </p>
      <div align="right">
        <Button variant="outlined" color="secondary" onClick={() => peticionDelete()}>
          Sí
        </Button>
        <Button onClick={() => abrirCerrarModalEliminar()}>No</Button>
      </div>
    </div>
  );

  const bodyInsertar = (
    <div className={styles.modal}>
      <h3>Agregar Nueva Comida</h3>
      <TextField
        name="name"
        className={styles.inputMaterial}
        label="Nombre"
        onChange={handleChange}
      />
      <br />
      <TextField
        name="description"
        className={styles.inputMaterial}
        label="Descripción"
        onChange={handleChange}
      />
      <br />
      <br />
      <div align="right">
        <Button color="primary" onClick={() => peticionPost()}>
          Agregar
        </Button>
        <Button onClick={() => abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  );

  return (
    <div className="App">
      <Button className={styles.button} variant="outlined" color="primary" onClick={() => abrirCerrarModalInsertar()}>
        Agregar <Add />
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Eliminar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((x) => (
              <TableRow key={x.id}>
                <TableCell>{x.name}</TableCell>
                <TableCell>{x.description}</TableCell>
                <TableCell>
                  <Delete
                    className={styles.iconos}
                    onClick={() => seleccionarComida(x)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Container>
      
      </Container>
      <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
      </Modal>

      <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
      </Modal>
    </div>
  );
}

export default App;
