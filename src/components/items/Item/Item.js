export default function Item({item, selectItem, isItemSelected = false}) {
    return (
        <div className="nes-container is-rounded" onClick={() => selectItem(item)} style={isItemSelected ? {backgroundColor: '#ff75a8', padding: '1rem'} : {}}>
            <img src={`data:image/png;base64,${item.image_file}`} style={{width: '100%'}}></img>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div>
                    <b>ITEM NAME</b>
                    {item.name}
                </div>
                <div>
                    <b>PRICE</b>
                    {item.price}
                </div>
            </div>
        </div>
    )
}
