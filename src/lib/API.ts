import { z } from "zod";
import { Course, CourseDescription, CourseDescriptionList } from "./utils";
export const BASE_URL = "https://cors-achei.mtapp.ao/api";
export const APP_NAME = "achei_portal";
export const APP_API = "https://student-achei.mtapp.ao/api";

export const schemaCreateStudent = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export type CreateStudent = z.infer<typeof schemaCreateStudent>;

export const SUBMIT_CODE_VERIFY = async ({
  email,
  code,
}: {
  email: string;
  code: string;
}) => {
  const response = await fetch(
    `${BASE_URL}/account/verify-email/${email}/${code}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return await response.json();
};

export const login = async ({
  email,
  password,
}: {
  email?: string;
  password?: string;
}) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return await response.json();
};

export const CREATE_ACCOUNT = async (data: CreateStudent) => {
  const response = await fetch(`${BASE_URL}/account/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const saveLocalStorageToken = (token: string) => {
  window.localStorage.setItem(`${APP_NAME}_`, token);
};

export const getsaveLocalStorageToken = () => {
  window.localStorage.getItem(`${APP_NAME}_`);
};

export const removeLocalStorageToken = () => {
  window.localStorage.removeItem(`${APP_NAME}_`);
};

/* export const SUBMIT_DATA_STUDENT = async (data: {
  full_name: string;
  birth_date: string;
  id_type: string;
  id_number: string;
  phone_number: string;
  address: string;
  observations: string;
}) => {
  const AUTH_TOKEN = window.localStorage.getItem(`${APP_NAME}_`);
  const response = await fetch(`${BASE_URL}/students/store-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}; */

/* export const REGISTER_CLASS = async (data: { class_id: string }) => {
  const AUTH_TOKEN = window.localStorage.getItem(`${APP_NAME}_`);
  const response = await fetch(`${BASE_URL}/registrations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}; */

export const SUBMIT_DATA_STUDENT = async (data: {
  full_name: string;
  birth_date: string;
  id_type: string;
  id_number: string;
  phone_number: string;
  address: string;
  observations: string;
}) => {
  const AUTH_TOKEN = window.localStorage.getItem(`${APP_NAME}_`);
  const response = await fetch(`${BASE_URL}/students/store-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const EDIT_DATA_STUDENT = async (data: {
  full_name: string;
  birth_date: string;
  id_type: string;
  id_number: string;
  phone_number: string;
  address: string;
  observations: string;
}) => {
  const AUTH_TOKEN = window.localStorage.getItem(`${APP_NAME}_`);
  const response = await fetch(`${BASE_URL}/students/update-data`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const REGISTER_CLASS = async (data: { class_id: string }) => {
  const AUTH_TOKEN = window.localStorage.getItem(`${APP_NAME}_`);
  const response = await fetch(`${BASE_URL}/registrations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const GET_CLASSES_PUBLIC = async (): Promise<CourseDescriptionList> => {
  const response = await fetch(`${APP_API}/courses-all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return (await response.json()) as CourseDescriptionList;
};

export const GET_COURSE_ONE = async (
  id: string
): Promise<CourseDescription> => {
  const response = await fetch(`${APP_API}/courses-one/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

export const GET_QUIZ = async (
  id: string
)=> {
  console.log(id)
  const response = await fetch(`https://server-app.mtapp.ao/api/response?course_id=${id}&api_key=123456789`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }); 
  return await response.json();
  
};
export const GET_ONE_QUIZ = async (
  id: string
)=> {
  console.log(id)
  const response = await fetch(`https://server-app.mtapp.ao/api/quiz/${id}?api_key=123456789`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }); 
  return await response.json();
  
};

export const POST_QUESTION = async (
  data
)=> {
  console.log(data)
  const response = await fetch(`https://server-app.mtapp.ao/api/response?api_key=123456789`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }); 
  return await response.json();
  
};
export const POST_PASSWORD = async (
  data
)=> {
  console.log(data)
  const AUTH_TOKEN = window.localStorage.getItem(`${APP_NAME}_`);
  const response = await fetch(`${BASE_URL}/profile/update-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    body: JSON.stringify(data),
  }); 
  return await response.json();
  
};
export const POST_QUIZ_SUBMIT = async (
  data
)=> {
  console.log(data)
  const response = await fetch(`https://server-app.mtapp.ao/api/finish?api_key=123456789`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }); 
  return await response.json();
  
};

export const POST_FORUM_POST = async (
  data
)=> {
  console.log(data)
  const response = await fetch(`https://server-app.mtapp.ao/api/post?api_key=123456789`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }); 
  return await response.json();
  
};

export const GET_ = async (
  id: string
)=> {
  console.log(id)
  const response = await fetch(`https://server-app.mtapp.ao/api/quiz/${id}?api_key=123456789`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }); 
  return await response.json();
  
};
export const GET_COMMENT_FORUM = async (
  id: string
)=> {
  console.log(id)
  const response = await fetch(`https://server-app.mtapp.ao/api/comment?api_key=123456789&post_id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }); 
  return await response.json();
};
export const DELETE_COMMENT_FORUM = async (
  id: string
)=> {
  console.log(id)
  const response = await fetch(`https://server-app.mtapp.ao/api/comment/${id}?api_key=123456789`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }); 
  return await response.json();
};


export const DELETE_POST_FORUM = async (
  id: string
)=> {
  console.log(id)
  const response = await fetch(`https://server-app.mtapp.ao/api/post/${id}?api_key=123456789`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }); 
  return await response.json();
};

export const POST_COMMENT = async (
  data: any
)=> {
  console.log(data)
  const response = await fetch(`https://server-app.mtapp.ao/api/comment?api_key=123456789
`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }); 
  return await response.json();
};

export const POST_LIKE = async (
  data: any
)=> {
  console.log(data)
  const response = await fetch(`https://server-app.mtapp.ao/api/like?api_key=123456789
`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }); 
  return await response.json();
};


export const GET_POSTS_FORUM = async (
  id: string
)=> {
  console.log(id)
  const response = await fetch(`https://server-app.mtapp.ao/api/post?api_key=123456789&course_id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }); 
  return await response.json();
};
export const GET_POST_FORUM = async (
  id: string
)=> {
  console.log(id)
  const response = await fetch(`https://server-app.mtapp.ao/api/post/${id}?api_key=123456789`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }); 
  return await response.json();
};
export const GET_CONTENT_COURSE = async (id: string): Promise<Course[]> => {
  //const AUTH_TOKEN = window.localStorage.getItem(`${APP_NAME}_`);
   const response = await fetch(
    `${APP_API}/course-contents/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log()
  return await response.json();
};

/* export const GET_CONTENT_COURSE = async (id: string): Promise<Course[]> => {
  const AUTH_TOKEN = "22|QTVhnwrPg3nFuakW3lCCEru1LjBWjGbk2hGfDWCj41b6f0ab";
  const response = await fetch(
    `https://www.enanza.ao/api/course-contents/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    }
  );
  return await response.json();
}; */

export const GET_CLASSES_AVAL = async () => {
  const response = await fetch(`${APP_API}/api/classes-available`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

export const GET_LOGIN_LOGS = async (id) => {
  const response = await fetch(`https://server-app.mtapp.ao/api/point?student_id=${id}&api_key=123456789`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
export const GET_FILE_ONE = async (id
) => {
  console.log(`https://server-app.mtapp.ao/api/uploads?course_id=${id}`)
  const response = await fetch(`https://server-app.mtapp.ao/api/uploads?course_id=${id}`, {
   method: "GET",
   headers: {
     "Content-Type": "application/json",
   },
 });
 return await response.json();
};

export const GET_MY_CLASSES = async () => {
  const AUTH_TOKEN = window.localStorage.getItem(`${APP_NAME}_`);
  const response = await fetch(`${BASE_URL}/registrations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
  });

  return await response.json();
};


export const GET_ME = async () => {
  const AUTH_TOKEN = window.localStorage.getItem(`${APP_NAME}_`);
  const response = await fetch(`${BASE_URL}/students/get-data`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
  });
   return await response.json();
};
