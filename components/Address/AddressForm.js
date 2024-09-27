import styles from "./AddressForm.module.css";

const optionsType = [
  {
    id: 1,
    value: "HOME",
    name: "Home",
  },
  {
    id: 2,
    value: "OFFICE",
    name: "Office",
  },
];

const AddressForm = (props) => {
  const { formik, action } = props;

  return (
    <div className="row gy-2">
      <div>
        <label htmlFor="address" className="form-label">
          Address
        </label>
        <textarea
          required
          name="address"
          placeholder="Address"
          id="address"
          className={`form-control ${
            formik.touched.address && formik.errors.address && "is-invalid"
          }`}
          value={formik.values.address}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        {formik.touched.address && formik.errors.address && (
          <div className="invalid-feedback">{formik.errors.address}</div>
        )}
      </div>
      <div>
        <label htmlFor="city" className="form-label">
          City
        </label>
        <input
          required
          name="city"
          placeholder="City"
          id="city"
          className={`form-control ${
            formik.touched.city && formik.errors.city && "is-invalid"
          }`}
          value={formik.values.city}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        {formik.touched.city && formik.errors.city && (
          <div className="invalid-feedback">{formik.errors.city}</div>
        )}
      </div>
      <div>
        <label htmlFor="pincode" className="form-label">
          Pin Code
        </label>
        <input
          required
          type="number"
          name="pincode"
          id="pincode"
          className={`form-control ${
            formik.touched.pincode && formik.errors.pincode && "is-invalid"
          }`}
          value={formik.values.pincode}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        {formik.touched.pincode && formik.errors.pincode && (
          <div className="invalid-feedback">{formik.errors.pincode}</div>
        )}
      </div>
      <div>
        <label htmlFor="state" className="form-label">
          State
        </label>
        <input
          required
          name="state"
          placeholder="State"
          id="state"
          className={`form-control ${
            formik.touched.state && formik.errors.state && "is-invalid"
          }`}
          value={formik.values.state}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        {formik.touched.state && formik.errors.state && (
          <div className="invalid-feedback">{formik.errors.state}</div>
        )}
      </div>
      <div>
        <label htmlFor="type" className="form-label">
          Type
        </label>
        <select
          name="type"
          id="type"
          className={`form-select ${
            formik.touched.type && formik.errors.type && "is-invalid"
          }`}
          value={formik.values.type}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        >
          {optionsType.map((option) => {
            return (
              <option key={option.id} value={option.value}>
                {option.name}
              </option>
            );
          })}
        </select>
        {formik.touched.type && formik.errors.type && (
          <div className="invalid-feedback">{formik.errors.type}</div>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
