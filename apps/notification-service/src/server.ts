import app from "./app";
import "./consumers/notification-status.consumer";

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});