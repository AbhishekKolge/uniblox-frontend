import styles from "./CouponFilterForm.module.css";

const optionsType = [
  {
    id: 1,
    value: "",
    name: "Select",
  },
  {
    id: 2,
    value: "PERCENTAGE",
    name: "Percent (%)",
  },
  {
    id: 3,
    value: "FIXED",
    name: "Rupees (₹)",
  },
];

const redemptionSortType = [
  {
    id: 1,
    value: "",
    name: "Select",
  },
  {
    id: 2,
    value: "highest",
    name: "High-Low",
  },
  {
    id: 3,
    value: "lowest",
    name: "Low-High",
  },
];

const sortType = [
  {
    id: 1,
    value: "latest",
    name: "Latest",
  },
  {
    id: 2,
    value: "oldest",
    name: "Oldest",
  },
];

const CouponFilterForm = (props) => {
  const { queries, setQueries } = props;

  const filterChangeHandler = (e) => {
    setQueries((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
        page: 1,
      };
    });
  };

  const clearFiltersHandler = () => {
    setQueries({
      search: "",
      type: "",
      sort: "latest",
      page: 1,
    });
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row gy-2">
          <div className="col-3">
            <label htmlFor="search" className="form-label">
              Search Code
            </label>
            <input
              value={queries.search}
              onChange={filterChangeHandler}
              name="search"
              id="search"
              placeholder="Search Code"
              className="form-control"
            />
          </div>
          <div className="col-3">
            <label htmlFor="type" className="form-label">
              Discount Type
            </label>
            <select
              value={queries.type}
              onChange={filterChangeHandler}
              name="type"
              id="type"
              className="form-select"
            >
              {optionsType.map((option) => {
                return (
                  <option key={option.id} value={option.value}>
                    {option.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-3">
            <label htmlFor="sort" className="form-label">
              Sort
            </label>
            <select
              value={queries.sort}
              onChange={filterChangeHandler}
              name="sort"
              id="sort"
              className="form-select"
            >
              {sortType.map((option) => {
                return (
                  <option key={option.id} value={option.value}>
                    {option.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-3">
            <button
              onClick={clearFiltersHandler}
              className={`btn btn-primary btn-sm w-100 ${styles.filterBtn}`}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponFilterForm;
