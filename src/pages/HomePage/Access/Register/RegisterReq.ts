export const CREATE_USER_ACCOUNT = async (name:string, email:string, password:string) => {
  const raw = JSON.stringify({
    name: name,
    email: email,
    password: password,
  });

  try {
    const response = await fetch(`http://cors-achei.mtapp.ao/api/account/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: raw,
    });

    // Verifica se a resposta HTTP foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }

    return await response.json(); // Tenta converter a resposta para JSON
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error; // Lança o erro para ser tratado no `handleSubmit`
  }
};
