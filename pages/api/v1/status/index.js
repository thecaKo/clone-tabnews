function Status(request, response) {
  response.status(200).json({
    nome: "Carlos",
  });
}

export default Status;
