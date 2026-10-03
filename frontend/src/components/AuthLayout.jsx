import React from "react";

export default function AuthLayout({
    icon: Icon,
    title,
    subtitle,
    footer,
    children,
    maxWidthClass = "max-w-md"
}) {
    return (
        <div className="flex justify-center bg-background px-4 pt-4 sm:pt-6 md:pt-8 pb-12">
            <div className={`w-full ${maxWidthClass}`}>
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center gap-3 mb-2">
                        {Icon && (
                            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary text-primary-foreground shadow-sm shrink-0">
                                <Icon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                            </div>
                        )}
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            {title}
                        </h1>
                    </div>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className="bg-card rounded-2xl shadow-sm border border-border p-6 sm:p-8">
                    {children}
                </div>
                {footer && (
                    <div className="text-center text-sm text-muted-foreground mt-5">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
