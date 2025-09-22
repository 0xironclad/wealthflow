import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import { ComponentType } from "react"

const SwaggerUIComponent = SwaggerUI as ComponentType<{ url: string }>

export default function Docs() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">API Documentation</h1>
            <SwaggerUIComponent url="/swagger.json" />
        </div>
    );
}
