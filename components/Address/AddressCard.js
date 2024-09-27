import styles from "./AddressCard.module.css";

const AddressCard = (props) => {
  const { addresses, deleteButtonProps, onDelete, onEdit, buttonProps, onAdd } =
    props;

  return (
    <div className="row">
      <div className="fs-8">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h4 className="card-title">Saved Addresses</h4>
            <button
              onClick={onAdd}
              {...buttonProps}
              className="btn btn-primary border-dark btn-sm"
            >
              Add New Address
            </button>
          </div>
          <div className="card-body">
            <div className="d-flex flex-column gap-3">
              {addresses.length ? (
                addresses.map((address) => {
                  return (
                    <div className="card" key={address.id}>
                      <div className="card-body position-relative d-flex flex-column">
                        <span className="badge rounded-pill text-bg-primary position-absolute top-20 end-0 me-3">
                          {address.type}
                        </span>
                        <span className="text-capitalize">
                          {address.address}
                        </span>
                        <span className="text-capitalize">
                          {address.city} - {address.pincode}
                        </span>
                        <span className="text-capitalize">{address.state}</span>
                        <span className="text-capitalize">
                          {address.country}
                        </span>
                      </div>
                      <div className="card-footer d-flex gap-3 justify-content-end">
                        <button
                          onClick={onEdit.bind(this, {
                            id: address.id,
                            addressDetails: {
                              address: address.address,
                              city: address.city,
                              pincode: address.pincode,
                              state: address.state,
                              type: address.type,
                            },
                          })}
                          {...buttonProps}
                          className="btn btn-warning text-light btn-sm"
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button
                          {...deleteButtonProps}
                          onClick={onDelete.bind(this, address.id)}
                          className="btn btn-danger text-light btn-sm"
                        >
                          <i className="bi bi-trash3-fill"></i>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <span>No Address added</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
