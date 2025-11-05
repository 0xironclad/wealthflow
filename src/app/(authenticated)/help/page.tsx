"use client"

import { useState, useEffect } from "react"
import {
    HelpCircle,
    BookOpen,
    MessageCircle,
    Mail,
    ArrowRight,
    Wallet,
    Target,
    BarChart3,
    Zap,
    Shield,
    CreditCard,
    Bot,
} from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

const faqCategories = [
    {
        title: "Getting Started",
        icon: Zap,
        color: "text-blue-500",
        questions: [
            {
                question: "How do I add my first transaction?",
                answer: "Click the 'Add Transaction' button in the Quick Actions menu or navigate to the Transactions page. Fill in the transaction details including name, amount, date, category, and payment method, then click Save.",
            },
            {
                question: "How do I set up a budget?",
                answer: "Click 'Create Budget' in the Quick Actions menu or navigate to the Budget page. Select a category, set your planned amount, choose a period (monthly, weekly, etc.), and set your start and end dates. The budget will automatically track your spending.",
            },
            {
                question: "How do I create a savings goal?",
                answer: "Click 'Add Savings' in the Quick Actions menu or navigate to the Goals page. Enter your goal name, target amount, and optional target date. You can then add money to your goal from the savings details page.",
            },
        ],
    },
    {
        title: "Transactions & Expenses",
        icon: CreditCard,
        color: "text-green-500",
        questions: [
            {
                question: "How do I categorize my expenses?",
                answer: "When creating a transaction, select from predefined categories: Food, Rent, Transport, Entertainment, Health, Utilities, Education, Shopping, Saving, or Other. This helps track your spending patterns.",
            },
            {
                question: "Can I edit or delete a transaction?",
                answer: "Yes! Go to the Transactions page, find the transaction you want to modify, and click on it. You can edit all details or delete the transaction entirely. Note that deleting expenses will update your budget automatically.",
            },
            {
                question: "How are transactions linked to budgets?",
                answer: "When you add an expense transaction, WealthFlow automatically checks if you have an active budget for that category and date range. If found, it updates the spent amount in real-time.",
            },
        ],
    },
    {
        title: "Budgets & Planning",
        icon: Target,
        color: "text-purple-500",
        questions: [
            {
                question: "How do budget periods work?",
                answer: "Budgets can be set for daily, weekly, or monthly periods. The system tracks your spending against the planned amount for the selected period and warns you when you're approaching your limit.",
            },
            {
                question: "What happens when I exceed my budget?",
                answer: "WealthFlow will highlight budgets that are at risk. You can see your progress visually with progress indicators. Consider adjusting your budget or reducing spending in that category.",
            },
            {
                question: "Can I have multiple budgets for the same category?",
                answer: "Yes, but they must have different periods or date ranges. For example, you can have a monthly Food budget and a separate weekly Food budget, or overlapping budgets with different date ranges.",
            },
        ],
    },
    {
        title: "Savings & Goals",
        icon: Wallet,
        color: "text-orange-500",
        questions: [
            {
                question: "How do I add money to a savings goal?",
                answer: "Click on 'View details' for the savings goal you want to add money to, then click 'Add Money'. Enter the amount you want to deposit. This will be deducted from your total balance and added to your goal. A deposit transaction will be recorded in your history.",
            },
            {
                question: "Can I withdraw money from a savings goal?",
                answer: "Yes, click on 'View details' for the savings goal you want to withdraw from, then click 'Withdraw Money'. The withdrawn amount will be added back to your total balance. A withdrawal transaction will be recorded in your history.",
            },
            {
                question: "What happens when I delete a savings goal?",
                answer: "If your goal has remaining funds, they will automatically be added back to your total balance. A withdrawal transaction will be recorded to maintain accurate financial tracking.",
            },
        ],
    },
    {
        title: "AI Chatbot",
        icon: Bot,
        color: "text-cyan-500",
        questions: [
            {
                question: "How do I access the AI chatbot?",
                answer: "The AI chatbot is available as a floating button in the bottom-right corner of your screen. Click on it to open the chat interface and start asking questions about your finances.",
            },
            {
                question: "What can the AI chatbot help me with?",
                answer: "The WealthFlow AI assistant can help you with budgeting advice, expense analysis, savings goal planning, spending pattern insights, and financial recommendations. It uses your actual financial data to provide personalized guidance.",
            },
            {
                question: "How does the AI use my financial data?",
                answer: "The AI chatbot analyzes your transactions, budgets, savings goals, and income to provide personalized financial insights and recommendations. It only accesses your data to help you make better financial decisions and never shares your information externally.",
            },
            {
                question: "Can the AI help me create or adjust budgets?",
                answer: "Yes! The AI can analyze your spending patterns and suggest budget adjustments based on your actual expenses. You can ask it questions like &apos;Should I adjust my food budget?&apos; or &apos;What&apos;s a good budget for groceries?&apos;",
            },
            {
                question: "Is my data secure when using the chatbot?",
                answer: "Absolutely. The AI chatbot uses secure API endpoints and only accesses your financial data that's already stored securely in WealthFlow. Your conversations are not stored permanently, and all data transmission is encrypted.",
            },
            {
                question: "Can I ask the AI about savings goals?",
                answer: "Yes! The AI can help you track progress on your savings goals, suggest ways to reach them faster, and provide insights on your savings patterns. Ask questions like &apos;How am I doing with my vacation fund?&apos; or &apos;What should I save for next?&apos;",
            },
        ],
    },
    {
        title: "Account & Settings",
        icon: Shield,
        color: "text-red-500",
        questions: [
            {
                question: "How do I update my profile?",
                answer: "Click on your avatar in the header dropdown and select 'Profile'. Here you can view and manage your account information, email verification status, and account details.",
            },
            {
                question: "How do I change my theme?",
                answer: "Click on your avatar in the header, then hover over 'Theme' to see options for Light, Dark, or System theme. Your preference will be saved automatically.",
            },
            {
                question: "Is my financial data secure?",
                answer: "Yes, WealthFlow uses secure authentication through Supabase and stores your data in a secure PostgreSQL database. Your financial information is encrypted and only accessible to you.",
            },
        ],
    },
]

const quickLinks = [
    {
        title: "Overview Dashboard",
        description: "View your financial summary at a glance",
        icon: BarChart3,
        href: "/overview",
    },
    {
        title: "Transaction History",
        description: "Manage all your income and expenses",
        icon: CreditCard,
        href: "/transaction",
    },
    {
        title: "Budget Manager",
        description: "Create and track your budgets",
        icon: Target,
        href: "/budget",
    },
    {
        title: "Savings Goals",
        description: "Set and achieve your financial goals",
        icon: Wallet,
        href: "/goals",
    },
]

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)

    const allQuestions = faqCategories.flatMap((category, categoryIndex) =>
        category.questions.map((q, questionIndex) => ({
            ...q,
            category: category.title,
            categoryIndex,
            questionIndex,
            value: `${categoryIndex}-${questionIndex}`,
        }))
    )

    const filteredQuestions = searchQuery
        ? allQuestions.filter(
            (q) =>
                q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : []

    const groupedQuestions = filteredQuestions.reduce((acc, question) => {
        if (!acc[question.category]) {
            acc[question.category] = []
        }
        acc[question.category].push(question)
        return acc
    }, {} as Record<string, typeof filteredQuestions>)

    const filteredCategories = faqCategories

    useEffect(() => {
        if (selectedQuestion) {
            setTimeout(() => {
                const element = document.getElementById(`faq-item-${selectedQuestion}`)
                if (element) {
                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    })
                }
            }, 150)
        }
    }, [selectedQuestion])

    return (
        <div className="h-full w-full flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col gap-2 items-start justify-center pb-4">
                <div className="max-w-5xl mx-auto w-full px-4 pt-4">
                    <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
                    <p className="text-muted-foreground">
                        Find answers to common questions and get the most out of WealthFlow
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto styled-scrollbar pb-6">
                <div className="max-w-5xl mx-auto space-y-6 px-4">
                    {/* Search Bar */}
                    <Card className="border-2">
                        <CardContent className="p-6">
                            <Command className="rounded-lg border-0 shadow-none" shouldFilter={false}>
                                <CommandInput
                                    placeholder="Search for help articles, FAQs, or topics..."
                                    value={searchQuery}
                                    onValueChange={setSearchQuery}
                                />
                                {searchQuery && (
                                    <CommandList className="max-h-[300px]">
                                        <CommandEmpty>No results found.</CommandEmpty>
                                        {Object.entries(groupedQuestions).length > 0 && (
                                            Object.entries(groupedQuestions).map(([category, questions]) => (
                                                <CommandGroup key={category} heading={category}>
                                                    {questions.map((question) => (
                                                        <CommandItem
                                                            key={question.value}
                                                            value={`${question.question} ${question.answer} ${question.category}`}
                                                            onSelect={() => {
                                                                setSelectedQuestion(question.value)
                                                                setSearchQuery("")
                                                                // Scroll will happen via useEffect
                                                            }}
                                                            className="cursor-pointer"
                                                        >
                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-medium">{question.question}</span>
                                                                <span className="text-xs text-muted-foreground line-clamp-1">
                                                                    {question.answer}
                                                                </span>
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            ))
                                        )}
                                    </CommandList>
                                )}
                            </Command>
                        </CardContent>
                    </Card>

                    {/* Quick Links */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Quick Links
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {quickLinks.map((link) => (
                                <Card
                                    key={link.title}
                                    className="hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full"
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                <link.icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <CardTitle className="text-base">{link.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <CardDescription className="text-sm">
                                            {link.description}
                                        </CardDescription>
                                    </CardContent>
                                    <CardFooter className="mt-auto pt-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-between group-hover:text-primary"
                                            asChild
                                        >
                                            <a href={link.href}>
                                                Go to page
                                                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </a>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Sections */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <HelpCircle className="h-5 w-5" />
                            Frequently Asked Questions
                        </h2>

                        {filteredCategories.map((category, categoryIndex) => (
                            <Card key={category.title} className="overflow-hidden">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-3">
                                        <div className={cn("p-2 rounded-lg bg-primary/10", category.color)}>
                                            <category.icon className="h-5 w-5" />
                                        </div>
                                        {category.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="w-full"
                                        value={selectedQuestion || undefined}
                                        onValueChange={setSelectedQuestion}
                                    >
                                        {category.questions.map((item, questionIndex) => {
                                            const value = `${categoryIndex}-${questionIndex}`
                                            return (
                                                <AccordionItem
                                                    key={questionIndex}
                                                    value={value}
                                                    className="border-b"
                                                    id={`faq-item-${value}`}
                                                >
                                                    <AccordionTrigger className="text-left hover:no-underline">
                                                        <span className="font-medium">{item.question}</span>
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                                            {item.answer}
                                                        </p>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            )
                                        })}
                                    </Accordion>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageCircle className="h-5 w-5" />
                                Still need help?
                            </CardTitle>
                            <CardDescription>
                                Can&apos;t find what you&apos;re looking for? Reach out to our support team
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button variant="outline" className="flex-1" asChild>
                                    <a href="mailto:chemerilcollins@gmail.com">
                                        <Mail className="mr-2 h-4 w-4" />
                                        Email Support
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

