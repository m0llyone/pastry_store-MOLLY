import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  Edit,
  SimpleForm,
  TextInput,
  ArrayField,
  ChipField,
  SingleFieldList,
  SimpleFormIterator,
  useRecordContext,
  Create,
  BooleanInput,
  ArrayInput,
  required,
  ReferenceField,
  Filter,
  SelectInput,
} from 'react-admin';
import Dropzone from 'react-dropzone';
import { CloudUpload } from '@mui/icons-material';
import { useState } from 'react';

export const GetProducts = () => {
  return (
    <List>
      <Datagrid rowClick="show">
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="price" />
        <TextField source="description" />
        {/* <TextField source="category.category" /> */}
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
        <TextInput source="id" disabled label="ID" />
        <TextInput source="category" disabled label="Категория" />
        <TextInput source="title" label="Название" />
        <ArrayInput source="features" label="Особенности">
          <SimpleFormIterator>
            <TextInput label="Особенность" />
          </SimpleFormIterator>
        </ArrayInput>
        <TextInput source="price" label="Цена" />
        <TextInput source="description" label="Описание" />
        <BooleanInput source="isBestseller" label="Бестселлер" />
      </SimpleForm>
    </Edit>
  );
};

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '5px',
  padding: '10px',
  textAlign: 'center',
  cursor: 'pointer',
  marginTop: '10px',
};

export const CreateProduct = () => {
  const maxFeatures = (value) => (value && value.length > 3 ? 'Максимум 3 особенности' : undefined);

  const [images, setImages] = useState([]);

  const handleDrop = (acceptedFiles) => {
    // Обрабатываем загруженные изображения
    setImages(acceptedFiles.slice(0, 3)); // Ограничиваем количество изображений до 3
  };
  return (
    <Create title="Создание продукта">
      <SimpleForm>
        <TextInput source="title" label="Название" validate={required()} />
        <ArrayInput source="features" label="Особенности" validate={maxFeatures}>
          <SimpleFormIterator>
            <TextInput label="Особенность" validate={required()} />
          </SimpleFormIterator>
        </ArrayInput>
        {/* <div>
          <label>Изображения:</label>
          <Dropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} style={dropzoneStyle}>
                <input {...getInputProps()} />
                <CloudUpload fontSize="large" />
                <p>Перетащите файлы сюда или нажмите, чтобы выбрать.</p>
              </div>
            )}
          </Dropzone>
          <ul>
            {images.map((image, index) => (
              <li key={index}>{image.name}</li>
            ))}
          </ul>
        </div> */}
        <TextInput source="price" label="Цена" validate={required()} />
        {/* <TextInput source="category" label="Цена" validate={required()} /> */}
        <TextInput source="amount" label="Количество" validate={required()} />
        <TextInput source="description" label="Описание" validate={required()} />
        <BooleanInput source="isBestseller" label="Бестселлер" />
      </SimpleForm>
    </Create>
  );
};
