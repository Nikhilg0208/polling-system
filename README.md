# Polling System

## Overview

This project implements a real-time polling system using Kafka, Zookeeper, WebSockets, and a Node.js backend with Prisma ORM and PostgreSQL.

## Prerequisites

Ensure you have the following installed:

- Node.js (>=18)
- Kafka & Zookeeper
- PostgreSQL

## Setup Instructions

### 1. Install Dependencies

npm install

### 2. Setup Kafka & Zookeeper

Start Zookeeper:

zookeeper-server-start.sh config/zookeeper.properties

Start Kafka:

kafka-server-start.sh config/server.properties

Create the necessary Kafka topic:

kafka-topics.sh --create --topic poll-votes --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1


### 3. Setup Database

Create a PostgreSQL database and update `.env` with the correct credentials.
Run migrations:

npm run generate

### 4. Run the Backend

npm run dev

### 5. WebSocket Setup

The WebSocket server is integrated within the backend and runs on the same port.

## Running the Application

- Start Kafka & Zookeeper.
- Run the backend.
- Use a client to send votes via Kafka.
- Real-time poll updates are broadcast via WebSockets.

## Testing Real-time Poll Updates & Leaderboard

1. Send votes using Kafka producer.
2. Consume messages with the Kafka consumer.
3. WebSocket clients receive real-time updates on poll results.

## Environment Variables

KAFKA_BROKER=localhost:9092
DATABASE_URL=postgresql://user:password@localhost:5432/polling_db


## API Endpoints

- `POST /polls/vote` - Cast a vote
- `GET /polls/:pollId/results` - Fetch poll results
- WebSocket: `pollUpdated` event for real-time updates

