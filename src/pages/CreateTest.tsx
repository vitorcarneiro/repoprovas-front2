import {
  Box,
  Button,
  Divider,
  Typography,
  TextField,
  MenuItem
} from "@mui/material";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Form from "../components/Form";
import useAlert from "../hooks/useAlert";
import api, {
  Category,
  TeacherDisciplines,
} from "../services/api";

const styles = {
  container: {
    marginTop: "180px",
    width: "460px",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  title: { marginBottom: "30px" },
  dividerContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "16px",
    marginBottom: "26px",
  },
  input: {
    marginBottom: "16px",
    width: "100%",
  },
  actionsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};

function CreateTest() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [teachersDisciplines, setTeachersDisciplines] = useState<TeacherDisciplines[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { setMessage } = useAlert();
  const [formData, setFormData] = useState({
    name: "",
    pdfUrl: "",
    categoryId: null,
    teacherDisciplineId: null,
    disciplineId: null,
  });

  useEffect(() => {
    async function loadPage() {
      if (!token) return;

      const { data: { testsInfos } } = await api.getInfoForCreateTest(token);
      
      setTeachersDisciplines(testsInfos.teachersDisciplines);
      setCategories(testsInfos.categories);
    }
    loadPage();
  }, [token]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    console.log(formData);

    if (
      !formData?.name ||
      !formData?.pdfUrl ||
      !formData?.categoryId ||
      !formData?.teacherDisciplineId ||
      !formData?.disciplineId
    ) {
      setMessage({ type: "error", text: "Todos os campos são obrigatórios!" });
      return;
    }

    const { name, pdfUrl, categoryId, teacherDisciplineId } = formData;
    try {
      if (token)
        await api.createTest(token, { name, pdfUrl, categoryId, teacherDisciplineId });
      
        navigate("/app/disciplinas");

    } catch (error: Error | AxiosError | any) {
      if (error.response) {
        setMessage({
          type: "error",
          text: error.response.data,
        });
        return;
      }

      setMessage({
        type: "error",
        text: "Erro, tente novamente em alguns segundos!",
      });
    }
  }

  return (
    <>
      <Typography
       sx={{
        textAlign: "center",
        fontFamily: "Poppins",
        fontWeight: "500",
        fontSize: "24px",
        marginBottom: "50px"
      }}
      >Adicione uma prova</Typography>
      <Divider sx={{ marginBottom: "35px" }} />
      <Box
        sx={{
          marginX: "auto",
          width: "700px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/app/disciplinas")}
          >
            Disciplinas
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/app/pessoas-instrutoras")}
          >
            Pessoa Instrutora
          </Button>
          <Button variant="contained">
            Adicionar
          </Button>
        </Box>
        <Form onSubmit={handleSubmit}>

          <TextField
            name="name"
            sx={styles.input}
            label="Título da prova"
            onChange={handleInputChange}
            value={formData.name}
          />

          <TextField
            name="pdfUrl"
            sx={styles.input}
            label="PDF da prova"
            onChange={handleInputChange}
            value={formData.pdfUrl}
          />

          <TextField select
            name="categoryId"
            sx={styles.input}
            label="Categoria"
            onChange={handleInputChange}
            value={formData.categoryId}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>

            {categories.map(category => {
              return (
                <MenuItem value={category.id}>
                  {category.name}
                </MenuItem>
              );
            })}
          </TextField>

          <TextField select
            name="disciplineId"
            sx={styles.input}
            label="Disciplina"
            onChange={handleInputChange}
            value={formData.disciplineId}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>

            {teachersDisciplines.map(td => {
              return (
                <MenuItem value={td.discipline.id}>
                  {td.discipline.name}
                </MenuItem>
              );
            })}
          </TextField>

          <TextField select
            disabled={formData.disciplineId === null ? true : false}
            name="teacherDisciplineId"
            sx={styles.input}
            label="Pessoa Instrutora"
            onChange={handleInputChange}
            value={formData.teacherDisciplineId}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>

            {teachersDisciplines.map(td => {
              if(td.discipline.id === formData.disciplineId)
                return (
                  <MenuItem value={td.id}>
                    {td.teacher.name}
                  </MenuItem>
                );
            })}
          </TextField>

          <Button variant="contained" type="submit" sx={styles.input}>
            Enviar
          </Button>
        </Form>
      </Box>
    </>
  );
}

export default CreateTest;
