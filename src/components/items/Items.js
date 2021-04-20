
import { Grid } from 'semantic-ui-react'
import Item from './Item/Item'

export default function Items({items, setItem, selectedItem}) {
    console.log(selectedItem);
    return (
        <Grid container columns={3}>
            {items.map(item =>
            <Grid.Column key={item.id}>
                <Item item={item} selectItem={setItem} isItemSelected={selectedItem?.id == item.id} />
            </Grid.Column> )}
        </Grid>
    )
}