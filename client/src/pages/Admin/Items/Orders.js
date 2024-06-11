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
  SelectInput,
  required,
  // ReferenceInput,
} from 'react-admin';
import { Edit, SimpleForm, TextInput } from 'react-admin';

const GetOrders = () => {
  return (
    <List>
      <Datagrid rowClick="show">
        {/* <ReferenceInput source="userId" reference="users" /> */}
        <TextField source="id" />
        <ArrayField source="basket.items" disabled>
          <SingleFieldList>
            <ChipField source="quantity" />
          </SingleFieldList>
        </ArrayField>
        {/* <ArrayField source="basket"></ArrayField> */}
        <TextField source="basket.total" />
        <TextField source="status" />
        <DateField source="createdAt" showTime />
        <EditButton label="Изменить" />
        <DeleteButton label="Удалить" />
      </Datagrid>
    </List>
  );
};

export const EditOrder = () => {
  return (
    <Edit title="Редактировать заказ">
      <SimpleForm>
        <TextInput source="id" disabled />
        <SelectInput
          source="status"
          choices={[
            { id: 'Pending', name: 'Pending' },
            { id: 'Confirmed', name: 'Confirmed' },
            { id: 'Shipped', name: 'Shipped' },
            { id: 'Cancelled', name: 'Cancelled' },
          ]}
          validate={required()}
        />
      </SimpleForm>
    </Edit>
  );
};

export default GetOrders;
