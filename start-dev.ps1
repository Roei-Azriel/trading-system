$projects = @(
  "C:\Users\Roei\Desktop\trading system - Project\backend\services\user-service",
  "C:\Users\Roei\Desktop\trading system - Project\backend\services\wallet-service",
  "C:\Users\Roei\Desktop\trading system - Project\backend\services\order-service",
  "C:\Users\Roei\Desktop\trading system - Project\backend\gateway"
)

foreach ($project in $projects) {
  Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    "Set-Location '$project'; npm.cmd run dev"
  )
}
