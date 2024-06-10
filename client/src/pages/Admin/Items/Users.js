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
  SimpleList,
  Filter,
  useDataProvider,
  ListActions,
  useListContext,
} from 'react-admin';
import { useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { FilterComponent } from '../Filter';
// import { makeStyles } from '@mui/styled-engine';

// const useStyles = makeStyles({
//   datagrid: {
//     '@media (max-width: 600px)': {
//       '& .column-email': { display: 'none' },
//       '& .column-password': { display: 'none' },
//     },
//     '@media (max-width: 970px)': {
//       '& .column-roles': { display: 'none' },
//       '& .column-password': { display: 'none' },
//       '& .column-email': { display: 'none' },
//     },
//   },
// });

export const GetUsers = (props) => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <List {...props}>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.email}
          secondaryText={(record) => record.roles.join(', ')}
          tertiaryText={(record) => record.id}
          linkType="show"
        />
      ) : (
        <Datagrid rowClick="show">
          <TextField source="id" />
          <EmailField source="email" label="Почта" />
          <TextField source="password" label="Пароль" />
          <TextField source="roles" label="Роль" />
          <EditButton label="Изменить" />
          <DeleteButton label="Удалить" />
        </Datagrid>
      )}
    </List>
  );
};

export const EditUser = () => {
  return (
    <Edit title="Редактировать пользователя">
      <SimpleForm>
        <TextInput source="email" validate={[required(), minLength(5)]} />
        <TextInput source="password" validate={[required(), minLength(5)]} />
        <SelectInput
          source="roles"
          choices={[
            { id: 'ADMIN', name: 'ADMIN' },
            { id: 'USER', name: 'USER' },
          ]}
          validate={required()}
        />
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
        <SelectInput
          source="roles"
          choices={[
            { id: 'ADMIN', name: 'ADMIN' },
            { id: 'USER', name: 'USER' },
          ]}
          validate={required()}
        />
      </SimpleForm>
    </Create>
  );
};
