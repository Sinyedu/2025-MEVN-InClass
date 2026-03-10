import { reactive, watch } from "vue"

const isLoggedInFromStorage = localStorage.getItem("isLoggedIn") === "true"

export const state = reactive({
  isLoggedIn: isLoggedInFromStorage
})

watch(() => state.isLoggedIn, (newStateValue) => {
  localStorage.setItem("isLoggedIn", String(newStateValue))
})

