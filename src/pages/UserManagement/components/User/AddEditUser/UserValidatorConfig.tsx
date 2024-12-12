export default {
  firstName: {
    presence: { allowEmpty: false },
    length: {
      maximum: 35,
      message: 'should be less than 35 character'
    }
  },
  lastName: {
    presence: { allowEmpty: false },
    length: {
      maximum: 35,
      message: 'should be less than 35 character'
    }
  },
  email: {
    presence: { allowEmpty: false },
    email: true
  },
  phone: {
    presence: { allowEmpty: false }
  }
};
