import { useSelector } from 'react-redux';

const Review = () => {
  
  const formData = useSelector(state => state.formData);
  const selectedPokemon = useSelector(state => state.selectedPokemon)

    console.log(selectedPokemon);

  if (!formData || !selectedPokemon) {
    return (<p>No data available</p>);
  }

  console.log(formData);

  return (
    <div>
      <h1>Review</h1>
      
        <div>
          <p>
            <strong>First Name: </strong>
            {formData.firstName}
          </p>
          <p>
            <strong>Last Name: </strong>
            {formData.lastName}
          </p>
          <p>
            <strong>Phone Number: </strong>
            {formData.phoneNumber}
          </p>
          <p>
            <strong>Address: </strong>
            {formData.address}
          </p>

          {/* TODO selected pokemon */}
        </div>
    </div>
  );
};

export default Review;
