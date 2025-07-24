import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

export default function Docs() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">API Documentation</h1>
            <SwaggerUI url="/swagger.json" />
        </div>
    );
}
