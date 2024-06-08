import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  EmailField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  minLength,
  required,
  SelectInput,
} from 'react-admin';

export const GetUsers = () => {
  return (
    <List>
      <Datagrid rowClick="show">
        <TextField source="id" />
        <EmailField source="email" />
        <TextField source="password" />
        <TextField source="roles" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};

export const EditUser = () => {
  return (
    <Edit title="Редактировать пользователя" mutationMode="">
      <SimpleForm>
        <TextInput source="email" validate={[required(), minLength(10)]} />
        <TextInput source="password" validate={[required(), minLength(5)]} />
        {/* <TextInput source="role" /> */}
        {/* <SelectInput source="roles" choices={(['ADMIN'], ['USER'])} /> */}
      </SimpleForm>
    </Edit>
  );
};

export const CreateUser = () => {
  return (
    <Create title="Создание пользователя">
      <SimpleForm>
        <TextInput source="email" />
        <TextInput source="password" />
      </SimpleForm>
    </Create>
  );
};
