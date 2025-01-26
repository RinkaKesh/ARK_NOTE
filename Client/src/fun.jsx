import { useNavigate } from "react-router-dom"


export const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  return `Bearer ${token}`;
};

export const isAuth = () => {
  return getToken() !== null;
};


export const logout = (navigate) => {
  localStorage.clear()
  navigate("/")

}

export const getInitials = (name) => {
  if (!name) return "";
  const words = name.trim().split(/\s+/);
  const initials = words.slice(0, 3).map(word => word[0].toUpperCase()).join("");
  return initials;
};

export const getUsername = () => {
  const username = localStorage.getItem("username")
  if (!username) { return "null" }
  return username

}

let isLoading = false;

export const LoadingSpinner = () => {
  const spinner = document.createElement('div');
  spinner.id = 'loading-spinner';
  spinner.innerHTML = `
      <div class="spinner-container">
        <div class="spinner"></div>
      </div>
    `;
  document.body.appendChild(spinner);
};

export const removeLoadingSpinner = () => {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) {
    spinner.remove();
  }
};

export const showLoader = () => {
  if (!isLoading) {
    isLoading = true;
    LoadingSpinner();
  }
};

export const hideLoader = () => {
  if (isLoading) {
    isLoading = false;
    removeLoadingSpinner();
  }
};

export const getIsLoading = () => isLoading;


