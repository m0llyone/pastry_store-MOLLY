import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  EmailField,
  ArrayField,
  SingleFieldList,
  InnerDatagrid,
  ChipField,
  DateField,
  // ReferenceInput,
} from 'react-admin';
import { Edit, SimpleForm, TextInput } from 'react-admin';

const GetOrders = () => {
  return (
    <List>
      <Datagrid>
        {/* <ReferenceInput source="userId" reference="users" /> */}
        <TextField source="id" />
        <ArrayField source="basket.items">
          <SingleFieldList>
            <ChipField source="quantity" />
          </SingleFieldList>
        </ArrayField>
        <TextField source="basket.total" />
        <TextField source="status" />
        <DateField source="createdAt" showTime />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};

export const EditOrder = () => {
  return (
    <Edit title="Редактировать заказ">
      <SimpleForm>
        <TextInput source="id" disabled />
        <TextInput source="status" />
      </SimpleForm>
    </Edit>
  );
};

export default GetOrders;
