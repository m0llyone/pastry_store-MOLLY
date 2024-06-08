import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  Edit,
  SimpleForm,
  TextInput,
} from 'react-admin';

export const GetProducts = () => {
  return (
    <List>
      <Datagrid>
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="price" />
        <TextField source="description" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};

export const EditProduct = () => {
  return (
    <Edit title="Редактировать товар">
      <SimpleForm>
        <TextInput source="id" disabled />
        <TextInput source="title" />
        <TextInput source="price" />
        <TextInput source="description" />
      </SimpleForm>
    </Edit>
  );
};
