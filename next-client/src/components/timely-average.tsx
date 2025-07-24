function TimelyAverage({ title, amount }: { title: string; amount: number }) {
  return (
    <div className="flex flex-col h-full w-full">
      <p className="text-xs text-muted-foreground truncate">{title}</p>
      <p className="text-sm font-semibold text-foreground truncate">
        ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  )
}

export default TimelyAverage
