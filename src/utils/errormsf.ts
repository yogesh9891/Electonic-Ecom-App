export const errorMSg = (error: any) => {
  // console.log(error)
  // console.log(typeof error?.response?.data?.message)
  if (typeof error?.response?.data?.message == 'string')
    return error?.response?.data?.message;
  // alert(error?.response?.data?.message)
  else if (typeof error?.message == 'string') return error.message;
  // alert(error.message)
  else if (typeof error == 'string') return error;
  // alert(error)
  // alert("ERROR")
  else return 'ERROR';
};
